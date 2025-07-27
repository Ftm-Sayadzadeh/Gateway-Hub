import ipaddress

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError


class Gateway(models.Model) :
    name = models.CharField(max_length=100)
    address = models.GenericIPAddressField()
    port = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(65535)], # UDP/TCP
    )
    desc = models.TextField(blank=True , null=True)

    # extra field
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gateway"
        ordering = ['-created_at']
        verbose_name = "Gateway"
        verbose_name_plural = "Gateways"

    def __str__(self):
        return f"{self.name} ({self.address}:{self.port})"

    def clean(self):

        super().clean()

        # validate ip address??
        try:
            ipaddress.ip_address(self.address)
        except ValueError:
            raise ValidationError("Invalid address")

        # duplicated??
        if Gateway.objects.filter(
            address=self.address,
            port=self.port
        ).exclude(id=self.pk).exists():
            raise ValidationError("Gate way with this address and port already exists")

    def save(self, *args, **kwargs):
        self.full_clean()

        super().save(*args, **kwargs)

    @property
    def connection_string(self):
        return f"{self.address}:{self.port}"

    @property
    def is_local(self):
        try:
            ip = ipaddress.ip_address(self.address)
            return ip.is_private
        except ValueError:
            return False
