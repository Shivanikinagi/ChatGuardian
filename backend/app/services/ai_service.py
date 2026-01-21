import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Dict, List, Tuple
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    """Core AI service for message classification and processing"""
    
    def __init__(self):
        self.text_classifier = None
        self.embeddings_model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Emergency keywords (multi-language)
        self.emergency_keywords = {
            'english': [
                'emergency', 'urgent', 'hospital', 'accident', 'critical',
                'ambulance', 'police', 'fire', 'help', 'died', 'death',
                'heart attack', 'stroke', 'bleeding', 'unconscious',
                'icu', 'surgery', 'admit', 'crisis', 'danger'
            ],
            'hindi': [
                'आपातकाल', 'जरूरी', 'अस्पताल', 'दुर्घटना', 'मदद',
                'एम्बुलेंस', 'पुलिस', 'खतरा', 'मृत्यु', 'बीमार'
            ],
            'hinglish': [
                'emergency hai', 'hospital mein', 'accident ho gaya',
                'bahut serious', 'jaldi aao', 'help chahiye'
            ]
        }
        
        # Important keywords
        self.important_keywords = [
            'wedding', 'marriage', 'birthday', 'party', 'function',
            'booking', 'ticket', 'flight', 'train', 'visa',
            'admission', 'result', 'exam', 'interview', 'job',
            'property', 'investment', 'money', 'loan'
        ]
        
        # Noise patterns
        self.noise_patterns = [
            'good morning', 'good night', 'gm', 'gn',
            'forwarded message', 'forwarded as received',
            '⚠️ forwarded', 'please forward',
            'jai shri ram', 'jai mata di'
        ]
        
        # Fake news indicators
        self.fake_news_indicators = [
            'shocking', 'unbelievable', 'you won\'t believe',
            'share immediately', 'forward to all',
            'government hiding', 'doctors don\'t want you to know',
            'miracle cure', 'breaking news that media won\'t show'
        ]
    
    async def load_models(self):
        """Load AI models on startup"""
        try:
            logger.info("Loading AI models...")
            
            # Load embeddings model (lightweight, fast)
            logger.info(f"Loading embeddings model: {settings.EMBEDDINGS_MODEL}")
            self.embeddings_model = SentenceTransformer(settings.EMBEDDINGS_MODEL)
            
            # Load text classifier (for sentiment and intent)
            logger.info("Loading text classification pipeline...")
            self.text_classifier = pipeline(
                "text-classification",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=0 if self.device == "cuda" else -1
            )
            
            logger.info("All AI models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading AI models: {e}")
            raise
    
    async def classify_message(self, message: str, sender_info: Dict) -> Dict:
        """
        Main classification function
        Returns priority, confidence, categories, and other metadata
        """
        try:
            # Step 1: Emergency Detection (highest priority)
            is_emergency, emergency_confidence = self._detect_emergency(message)
            if is_emergency and emergency_confidence > settings.EMERGENCY_CONFIDENCE_THRESHOLD:
                return {
                    'priority': 'emergency',
                    'confidence': emergency_confidence,
                    'categories': ['emergency', 'health', 'urgent'],
                    'sentiment': 'negative',
                    'needs_response': True,
                    'is_fake_news': False
                }
            
            # Step 2: Fake News Detection
            is_fake, fake_score = await self._detect_fake_news(message)
            if is_fake and fake_score > settings.FAKE_NEWS_THRESHOLD:
                return {
                    'priority': 'blocked',
                    'confidence': fake_score,
                    'categories': ['fake_news', 'misinformation'],
                    'sentiment': 'neutral',
                    'needs_response': True,
                    'is_fake_news': True,
                    'fake_news_score': fake_score
                }
            
            # Step 3: Noise Detection
            if self._is_noise(message):
                return {
                    'priority': 'noise',
                    'confidence': 0.9,
                    'categories': ['greeting', 'forward', 'spam'],
                    'sentiment': 'neutral',
                    'needs_response': False,
                    'is_fake_news': False
                }
            
            # Step 4: Important Message Detection
            is_important, importance_score = self._detect_importance(message, sender_info)
            if is_important:
                return {
                    'priority': 'important',
                    'confidence': importance_score,
                    'categories': self._extract_categories(message),
                    'sentiment': await self._analyze_sentiment(message),
                    'needs_response': True,
                    'is_fake_news': False
                }
            
            # Step 5: Default to Informational
            return {
                'priority': 'informational',
                'confidence': 0.7,
                'categories': self._extract_categories(message),
                'sentiment': await self._analyze_sentiment(message),
                'needs_response': False,
                'is_fake_news': False
            }
            
        except Exception as e:
            logger.error(f"Error in message classification: {e}")
            return {
                'priority': 'informational',
                'confidence': 0.5,
                'categories': ['unknown'],
                'sentiment': 'neutral',
                'needs_response': False,
                'is_fake_news': False
            }
    
    def _detect_emergency(self, message: str) -> Tuple[bool, float]:
        """Detect emergency messages using keyword matching and pattern recognition"""
        message_lower = message.lower()
        
        # Count emergency keyword matches
        matches = 0
        total_keywords = 0
        
        for lang, keywords in self.emergency_keywords.items():
            total_keywords += len(keywords)
            for keyword in keywords:
                if keyword in message_lower:
                    matches += 1
        
        # Calculate confidence
        if matches == 0:
            return False, 0.0
        
        confidence = min(0.5 + (matches * 0.2), 0.99)
        
        # Additional patterns for high confidence
        urgent_patterns = ['911', '112', 'sos', 'died', 'death', 'icu']
        for pattern in urgent_patterns:
            if pattern in message_lower:
                confidence = min(confidence + 0.15, 0.99)
        
        return matches > 0, confidence
    
    async def _detect_fake_news(self, message: str) -> Tuple[bool, float]:
        """Detect fake news using multiple signals"""
        message_lower = message.lower()
        
        # Check for fake news indicators
        indicator_count = sum(1 for indicator in self.fake_news_indicators 
                             if indicator in message_lower)
        
        # Check for forwarded message patterns
        is_forwarded = any(pattern in message_lower 
                          for pattern in ['forwarded', 'forward this', 'share immediately'])
        
        # Check for sensational claims
        sensational_words = ['shocking', 'miracle', 'secret', 'hidden truth']
        sensational_count = sum(1 for word in sensational_words if word in message_lower)
        
        # Calculate fake news score
        score = 0.0
        if indicator_count > 0:
            score += 0.3 * indicator_count
        if is_forwarded:
            score += 0.2
        if sensational_count > 0:
            score += 0.2 * sensational_count
        
        # Cap at 0.95
        score = min(score, 0.95)
        
        return score > 0.5, score
    
    def _is_noise(self, message: str) -> bool:
        """Detect noise messages (good morning, forwards, etc.)"""
        message_lower = message.lower()
        
        # Check noise patterns
        for pattern in self.noise_patterns:
            if pattern in message_lower:
                return True
        
        # Check if message is just emojis or very short
        if len(message.strip()) < 5:
            return True
        
        # Check if message is a GIF/sticker reference
        if 'gif' in message_lower or 'sticker' in message_lower:
            return True
        
        return False
    
    def _detect_importance(self, message: str, sender_info: Dict) -> Tuple[bool, float]:
        """Detect important messages based on keywords and sender importance"""
        message_lower = message.lower()
        
        # Check important keywords
        keyword_matches = sum(1 for keyword in self.important_keywords 
                             if keyword in message_lower)
        
        # Get sender importance (1-10 scale)
        sender_importance = sender_info.get('importance', 5) / 10
        
        # Calculate importance score
        base_score = 0.5
        keyword_score = min(keyword_matches * 0.15, 0.3)
        sender_score = sender_importance * 0.3
        
        total_score = base_score + keyword_score + sender_score
        
        return total_score > settings.IMPORTANT_CONFIDENCE_THRESHOLD, total_score
    
    def _extract_categories(self, message: str) -> List[str]:
        """Extract message categories"""
        categories = []
        message_lower = message.lower()
        
        category_keywords = {
            'family_event': ['wedding', 'birthday', 'anniversary', 'function'],
            'travel': ['flight', 'train', 'ticket', 'booking', 'hotel'],
            'health': ['doctor', 'medicine', 'hospital', 'checkup'],
            'finance': ['money', 'payment', 'loan', 'investment'],
            'education': ['school', 'exam', 'result', 'admission'],
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                categories.append(category)
        
        return categories if categories else ['general']
    
    async def _analyze_sentiment(self, message: str) -> str:
        """Analyze message sentiment"""
        try:
            if self.text_classifier:
                result = self.text_classifier(message[:512])[0]
                label = result['label'].lower()
                
                if 'positive' in label:
                    return 'positive'
                elif 'negative' in label:
                    return 'negative'
                else:
                    return 'neutral'
            return 'neutral'
        except:
            return 'neutral'
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate text embedding for semantic search"""
        try:
            if self.embeddings_model:
                embedding = self.embeddings_model.encode(text)
                return embedding.tolist()
            return []
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return []
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up AI service...")
        self.text_classifier = None
        self.embeddings_model = None
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
