from django.apps import AppConfig
from transformers import pipeline

class AnalyzerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'analyzer'
    
    # Store the pipeline at the class level
    toxic_pipeline = None

    def ready(self):
        # Load unitary/toxic-bert model when Django starts
        if self.toxic_pipeline is None:
            print("Loading Hugging Face Toxic-BERT model. This might take a moment...")
            # We use unitary/toxic-bert, return_all_scores=True to get all labels
            self.toxic_pipeline = pipeline("text-classification", model="unitary/toxic-bert", top_k=None)
            print("Model loaded successfully!")