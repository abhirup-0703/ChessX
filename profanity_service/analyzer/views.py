from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps  # Import apps registry

class AnalyzeMessageView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        
        if not text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)

        # CORRECT FIX: Get the pipeline from the initialized AppConfig instance
        analyzer_config = apps.get_app_config('analyzer')
        pipeline = analyzer_config.toxic_pipeline
        
        # Get predictions
        # Output format is a list of lists: [[{'label': 'toxic', 'score': 0.98}, ...]]
        predictions = pipeline(text)[0] 
        
        # unitary/toxic-bert checks for 6 labels. Let's define our threshold (e.g., 60% certainty)
        TOXIC_LABELS = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']
        THRESHOLD = 0.60 

        is_toxic = False
        failed_labels = []

        for pred in predictions:
            if pred['label'] in TOXIC_LABELS and pred['score'] >= THRESHOLD:
                is_toxic = True
                failed_labels.append(pred['label'])

        return Response({
            'is_toxic': is_toxic,
            'violations': failed_labels
        }, status=status.HTTP_200_OK)