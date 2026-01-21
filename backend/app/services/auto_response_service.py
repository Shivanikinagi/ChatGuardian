from typing import Dict, Optional
import random
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AutoResponseEngine:
    """Generate contextually appropriate auto-responses"""
    
    def __init__(self):
        # Response templates based on priority and relationship
        self.response_templates = {
            'emergency': {
                'parent': [
                    "Saw your message! Calling you right now. ☎️",
                    "On my way! Just saw this.",
                    "Calling you immediately! 🚨"
                ],
                'elder': [
                    "Just saw this uncle/aunty. Calling you right away.",
                    "I'll call you right now to understand better."
                ],
                'peer': [
                    "Saw this! Calling you now.",
                    "On it! Calling you ASAP."
                ]
            },
            'important': {
                'parent': [
                    "Thanks for letting me know, Mom/Dad! 🙏",
                    "Got it! I'll take care of this.",
                    "Thank you for the update! Will check this out."
                ],
                'elder': [
                    "Thank you for sharing this, uncle/aunty! 🙏",
                    "Noted! I'll look into this.",
                    "Thanks for the information!"
                ],
                'peer': [
                    "Got it! Thanks for the heads up.",
                    "Awesome, thanks for sharing!",
                    "Cool, I'll check this out!"
                ]
            },
            'informational': {
                'parent': [
                    "👍",
                    "Got it!",
                    "Thanks for sharing!"
                ],
                'elder': [
                    "Thank you! 🙏",
                    "Noted!",
                    "Thanks!"
                ],
                'peer': [
                    "👍",
                    "Cool!",
                    "Nice!"
                ]
            },
            'noise': {
                'all': [
                    "🙏",  # Prayer hands (respectful acknowledgment)
                    "👍",  # Thumbs up
                    # Don't auto-respond to most noise
                ]
            },
            'fake_news': {
                'parent': [
                    "I checked this and it seems to be misinformation, Mom/Dad. I found this fact-check: {fact_check_link}",
                    "This might not be accurate. Here's what I found: {fact_check_link}"
                ],
                'elder': [
                    "Uncle/Aunty, this appears to be fake news. Here's the fact-check: {fact_check_link}",
                    "I checked and this isn't verified. Fact-check: {fact_check_link}"
                ],
                'peer': [
                    "This is fake news bro. Check: {fact_check_link}",
                    "Not true! Here's the fact-check: {fact_check_link}"
                ]
            }
        }
        
        # Time-based greetings
        self.time_based_additions = {
            'morning': ['Good morning!', 'Morning!'],
            'afternoon': ['Good afternoon!'],
            'evening': ['Good evening!'],
            'night': ['Thanks for the update!']
        }
    
    async def generate_response(
        self, 
        message: Dict,
        sender_info: Dict,
        classification: Dict
    ) -> Optional[str]:
        """
        Generate contextually appropriate auto-response
        
        Args:
            message: The message to respond to
            sender_info: Information about the sender (relationship, importance, etc.)
            classification: AI classification results
        
        Returns:
            Auto-response text or None if no response needed
        """
        try:
            priority = classification['priority']
            
            # Don't auto-respond to noise messages (except elders)
            if priority == 'noise':
                if sender_info.get('generation', 0) < 0:  # Elder
                    return random.choice(self.response_templates['noise']['all'])
                return None
            
            # Don't auto-respond to blocked messages initially
            if priority == 'blocked':
                return None  # Will be handled by fake news correction
            
            # Determine relationship category
            relationship_category = self._get_relationship_category(sender_info)
            
            # Get appropriate response templates
            templates = self.response_templates.get(priority, {}).get(
                relationship_category, 
                self.response_templates.get(priority, {}).get('peer', [])
            )
            
            if not templates:
                return None
            
            # Select random template
            response = random.choice(templates)
            
            # Add time-based greeting for important messages from elders
            if priority in ['important', 'emergency'] and sender_info.get('generation', 0) < 0:
                time_greeting = self._get_time_based_greeting()
                if time_greeting:
                    response = f"{time_greeting} {response}"
            
            # Personalize response
            response = self._personalize_response(response, sender_info)
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating auto-response: {e}")
            return None
    
    async def generate_fake_news_response(
        self,
        sender_info: Dict,
        fact_check_info: Optional[Dict] = None
    ) -> str:
        """Generate educational response for fake news"""
        relationship_category = self._get_relationship_category(sender_info)
        
        templates = self.response_templates['fake_news'].get(
            relationship_category,
            self.response_templates['fake_news']['peer']
        )
        
        response = random.choice(templates)
        
        # Add fact-check link if available
        if fact_check_info and fact_check_info.get('link'):
            response = response.format(fact_check_link=fact_check_info['link'])
        else:
            response = response.replace(' {fact_check_link}', '')
            response = response.replace('{fact_check_link}', 'Multiple fact-checkers have debunked this.')
        
        # Add educational note
        educational_notes = [
            "\n\nDid you know? Always verify news from multiple reliable sources before sharing. 📰",
            "\n\nTip: Check FactChecker.in, AltNews, or BoomLive before forwarding. ✅",
            "\n\nRemember: If something sounds too shocking, it's worth fact-checking first! 🔍"
        ]
        
        response += random.choice(educational_notes)
        
        return self._personalize_response(response, sender_info)
    
    def _get_relationship_category(self, sender_info: Dict) -> str:
        """Categorize relationship for response selection"""
        generation = sender_info.get('generation', 0)
        relationship = sender_info.get('relationship', '').lower()
        
        # Parents
        if 'mother' in relationship or 'father' in relationship or 'mom' in relationship or 'dad' in relationship:
            return 'parent'
        
        # Elders (uncles, aunts, grandparents)
        if generation < 0 or any(word in relationship for word in ['uncle', 'aunt', 'grand']):
            return 'elder'
        
        # Peers (siblings, cousins, friends)
        return 'peer'
    
    def _get_time_based_greeting(self) -> Optional[str]:
        """Get time-appropriate greeting"""
        current_hour = datetime.now().hour
        
        if 5 <= current_hour < 12:
            return random.choice(self.time_based_additions['morning'])
        elif 12 <= current_hour < 17:
            return random.choice(self.time_based_additions['afternoon'])
        elif 17 <= current_hour < 21:
            return random.choice(self.time_based_additions['evening'])
        else:
            return None
    
    def _personalize_response(self, response: str, sender_info: Dict) -> str:
        """Personalize response with sender's name/relationship"""
        relationship = sender_info.get('relationship', '')
        
        # Replace generic terms with specific relationship
        if 'uncle/aunty' in response:
            if 'uncle' in relationship.lower():
                response = response.replace('uncle/aunty', 'uncle ji')
            elif 'aunt' in relationship.lower():
                response = response.replace('uncle/aunty', 'aunty ji')
        
        if 'Mom/Dad' in response:
            if 'mother' in relationship.lower() or 'mom' in relationship.lower():
                response = response.replace('Mom/Dad', 'Mom')
            elif 'father' in relationship.lower() or 'dad' in relationship.lower():
                response = response.replace('Mom/Dad', 'Dad')
        
        return response
    
    def should_auto_respond(
        self,
        priority: str,
        sender_info: Dict,
        user_settings: Dict
    ) -> bool:
        """Determine if auto-response should be sent"""
        
        # Check if auto-response is enabled
        if not user_settings.get('auto_response_enabled', True):
            return False
        
        # Always respond to emergencies
        if priority == 'emergency':
            return True
        
        # Respond to important messages from elders
        if priority == 'important' and sender_info.get('generation', 0) < 0:
            return True
        
        # Optionally respond to important messages from close family
        if priority == 'important' and sender_info.get('importance', 0) >= 8:
            return True
        
        # Don't auto-respond to noise
        if priority == 'noise':
            return sender_info.get('generation', 0) < 0  # Only for elders
        
        # Don't auto-respond to blocked
        if priority == 'blocked':
            return False
        
        return False
