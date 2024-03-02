from django.db.models.signals import post_save, pre_delete
from .models import Profile
from django.dispatch import receiver
from django.conf import settings

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def post_save_create_profile(sender, instance, created, **kwargs):
    """
    Create a user profile when a new user is created.

    Args:
    - sender: The sender of the signal.
    - instance: The instance of the model that triggered the signal.
    - created: A boolean indicating whether the instance was created.
    - kwargs: Additional keyword arguments.

    Returns:
    None
    """
    if created and not Profile.objects.filter(user=instance).exists():
        Profile.objects.create(user=instance)
