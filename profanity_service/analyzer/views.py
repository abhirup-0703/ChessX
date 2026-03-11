import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import SimpleRateThrottle
from django.apps import apps

# --- 1. Define the Rate Limiter ---
class MessageRateThrottle(SimpleRateThrottle):
    # Set the rate limit: 2 requests per second
    rate = '2/s'

    def get_cache_key(self, request, view):
        # Throttle by the client's IP address
        ident = self.get_ident(request)
        return self.cache_format % {'scope': 'analyze_message', 'ident': ident}


class AnalyzeMessageView(APIView):
    # --- 2. Apply the Rate Limiter to this view ---
    throttle_classes = [MessageRateThrottle]

    def post(self, request):
        text = request.data.get('text', '')
        
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        is_toxic = False
        failed_labels = []

        # 1. OTP Check using Regex
        # \b ensures we only match whole words (so a 5-digit or 10-digit number won't trigger the 4/6 digit rule)
        if re.search(r'\b(\d{4}|\d{6})\b', text):
            is_toxic = True
            failed_labels.append('otp_detected')

        # 2. Profanity / Toxicity Check
        analyzer_config = apps.get_app_config('analyzer')
        pipeline = analyzer_config.toxic_pipeline
        
        # Get predictions from Hugging Face Model
        predictions = pipeline(text)[0] 
        
        TOXIC_LABELS = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
        THRESHOLD = 0.60 

        for pred in predictions:
            if pred['label'] in TOXIC_LABELS and pred['score'] >= THRESHOLD:
                is_toxic = True
                # Prevent duplicate labels just in case
                if pred['label'] not in failed_labels: 
                    failed_labels.append(pred['label'])

        return Response({
            'is_toxic': is_toxic,
            'violations': failed_labels
        }, status=status.HTTP_200_OK)