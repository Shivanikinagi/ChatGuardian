# Contributing to ChatGuardian

Thank you for your interest in contributing to ChatGuardian! This guide will help you get started.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Report issues you encounter
- ✨ **Feature Requests**: Suggest new features
- 📝 **Documentation**: Improve docs, add examples
- 🧪 **Testing**: Write tests, improve test coverage
- 💻 **Code**: Fix bugs, implement features
- 🌍 **Translations**: Add language support
- 🎨 **Design**: Improve UI/UX

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/chatguardian.git
cd chatguardian

# Add upstream remote
git remote add upstream https://github.com/original/chatguardian.git
```

### 2. Set Up Development Environment

```bash
# Install backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies

# Install mobile dependencies
cd ../mobile
npm install
```

### 3. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# OR
git checkout -b fix/bug-description
```

## 📝 Development Workflow

### Code Style

**Python (Backend)**
```bash
# Format code with Black
black app/

# Sort imports
isort app/

# Lint with flake8
flake8 app/

# Type check with mypy
mypy app/
```

**TypeScript/JavaScript (Mobile)**
```bash
# Lint with ESLint
npm run lint

# Format with Prettier
npm run format

# Type check
npx tsc --noEmit
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(ai): add multi-language fake news detection

fix(mobile): resolve crash on empty message list

docs(api): update API reference with new endpoints

test(backend): add tests for auto-response engine
```

### Testing

**Backend Tests**
```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_ai_service.py -v
```

**Mobile Tests**
```bash
cd mobile

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Update snapshots
npm test -- -u
```

### Pull Request Process

1. **Ensure tests pass**
   ```bash
   # Backend
   pytest

   # Mobile
   npm test
   ```

2. **Update documentation** if needed

3. **Create Pull Request**
   - Use clear, descriptive title
   - Reference related issues (#123)
   - Describe changes made
   - Add screenshots for UI changes
   - List breaking changes (if any)

4. **Address review feedback**

5. **Squash commits** (if requested)

## 🏗️ Project Structure

```
chatguardian/
├── mobile/                 # React Native app
│   ├── app/               # Screens
│   ├── components/        # UI components
│   ├── store/             # State management
│   ├── services/          # Business logic
│   └── __tests__/         # Tests
│
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── core/         # Configuration
│   └── tests/            # Tests
│
└── docs/                 # Documentation
```

## 🧪 Testing Guidelines

### What to Test

**Backend:**
- ✅ AI classification accuracy
- ✅ Auto-response generation
- ✅ API endpoints
- ✅ Database operations
- ✅ Edge cases (empty input, invalid data)

**Mobile:**
- ✅ Component rendering
- ✅ User interactions
- ✅ State management
- ✅ API integration
- ✅ Navigation flows

### Writing Tests

**Backend Example:**
```python
import pytest
from app.services.ai_service import AIService

@pytest.mark.asyncio
async def test_emergency_detection():
    ai_service = AIService()
    
    # Test emergency message
    result = await ai_service.classify_message(
        "Emergency! Dad in hospital!",
        {"importance": 10, "relationship": "mother"}
    )
    
    assert result['priority'] == 'emergency'
    assert result['confidence'] > 0.85
```

**Mobile Example:**
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MessageCard from '../MessageCard';

test('renders message correctly', () => {
  const message = {
    id: '1',
    content: 'Test message',
    priority: 'important',
    // ... other fields
  };
  
  const { getByText } = render(<MessageCard message={message} />);
  expect(getByText('Test message')).toBeTruthy();
});
```

## 📚 Documentation

### Code Documentation

**Python:**
```python
def classify_message(message: str, sender_info: Dict) -> Dict:
    """
    Classify a message using AI.
    
    Args:
        message: The message text to classify
        sender_info: Information about the sender
            - importance: 1-10 scale
            - relationship: 'mother', 'uncle', etc.
    
    Returns:
        Classification result containing:
            - priority: emergency/important/informational/noise/blocked
            - confidence: 0.0-1.0
            - categories: List of categories
            - sentiment: positive/neutral/negative
    
    Example:
        >>> result = await classify_message(
        ...     "Emergency! Hospital!", 
        ...     {"importance": 10}
        ... )
        >>> result['priority']
        'emergency'
    """
```

**TypeScript:**
```typescript
/**
 * Message Card Component
 * 
 * Displays a WhatsApp message with AI classification info
 * 
 * @param message - The message object to display
 * @param onPress - Optional callback when card is pressed
 * 
 * @example
 * ```tsx
 * <MessageCard 
 *   message={msg} 
 *   onPress={() => navigate('MessageDetail')} 
 * />
 * ```
 */
export function MessageCard({ message, onPress }: MessageCardProps) {
```

## 🐛 Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Android 12]
- App Version: [e.g., 1.0.0]
- Device: [e.g., Pixel 6]

**Additional context**
Any other relevant information
```

## ✨ Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives considered**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

## 🎨 Design Guidelines

### Mobile UI
- Follow Material Design 3 principles
- Use NativeWind (Tailwind) classes
- Maintain 4px grid system
- Support dark mode (future)
- Ensure accessibility (WCAG 2.1 AA)

### Colors
```typescript
primary: {
  50: '#f0f9ff',
  500: '#0ea5e9',
  700: '#0369a1'
}
emergency: '#ef4444'
important: '#f59e0b'
informational: '#3b82f6'
noise: '#6b7280'
```

## 🌍 Internationalization

### Adding a New Language

1. **Create translation file**
   ```typescript
   // mobile/translations/hi.json (Hindi)
   {
     "home.title": "होम",
     "messages.emergency": "आपातकाल",
     // ...
   }
   ```

2. **Update language detection**
   ```python
   # backend/app/services/ai_service.py
   self.emergency_keywords = {
     'hindi': ['आपातकाल', 'अस्पताल', ...]
   }
   ```

3. **Test with sample messages**

## 📊 Performance Guidelines

### Backend
- API response time < 200ms (p95)
- AI classification < 500ms
- Database queries < 50ms
- Support 100 req/sec

### Mobile
- App startup < 3s
- Screen transition < 300ms
- 60 FPS animations
- Bundle size < 50MB

## 🔒 Security Guidelines

- **Never commit** API keys, secrets, passwords
- Use environment variables
- Sanitize user input
- Validate data on backend
- Use parameterized queries (SQLAlchemy)
- Keep dependencies updated

## 🤝 Code Review

### What Reviewers Look For

- ✅ Code follows style guide
- ✅ Tests are included
- ✅ Documentation is updated
- ✅ No breaking changes (or documented)
- ✅ Performance impact considered
- ✅ Security best practices followed
- ✅ Edge cases handled

### Responding to Reviews

- Be respectful and professional
- Ask for clarification if needed
- Make requested changes
- Mark conversations as resolved
- Thank reviewers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## 💬 Getting Help

- 💬 [Discord Community](https://discord.gg/chatguardian)
- 📧 Email: dev@chatguardian.com
- 🐛 [GitHub Issues](https://github.com/original/chatguardian/issues)

## 📋 Checklist

Before submitting PR:

- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main
- [ ] All tests pass
- [ ] No linting errors
- [ ] PR description is clear

---

**Thank you for contributing to ChatGuardian! Together we're making family WhatsApp groups manageable! 🛡️**
