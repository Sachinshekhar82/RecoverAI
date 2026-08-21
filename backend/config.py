import os
from dotenv import load_dotenv

# Load environment variables from parent .env or current dir .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
load_dotenv()

class Settings:
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() == "true"
    
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_TS81e4x6YcQ00L")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "XQ5xIiF00C3g6IQDPL7y8Zim")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "AIzaSyAxv0ICU_96ZkvHLx0cRaH8Vp0Yms9YgRA")

    # Policy Engine Defaults
    MAX_PAYMENT_RETRIES: int = 3
    MAX_CUSTOMER_CONTACTS: int = 2
    MIN_COOLDOWN_MINUTES: int = 30
    MAX_RECOVERY_AMOUNT: float = 500000.0  # Max recovery per transaction in INR (₹5,00,000)

settings = Settings()
