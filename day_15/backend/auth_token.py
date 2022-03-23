from base64 import b64decode, b64encode
from binascii import Error as B64DecodeError
from os import urandom

from hata import  now_as_id, DATETIME_FORMAT_CODE, id_to_datetime


class AuthToken:
    __slots__ = ('_cached', 'user_id', 'version', 'value')
    
    def __new__(cls, user_id, version, value):
        self = object.__new__(cls)
        self.user_id = user_id
        self.version = version
        self.value = value
        self._cached = None
        return self
    
    
    @classmethod
    def create_new(cls, user_id):
        return cls(user_id, now_as_id(), urandom(32))
    
    
    @classmethod
    def from_string(cls, token):
        token_parts = token.split('.')
        if len(token_parts) != 3:
            return None
        
        user_id_key, version_key, value_key = token_parts
        
        try:
            value = b64decode(value_key)
        except B64DecodeError:
            return None
        
        if len(value) != 32:
            return
        
        try:
            bytes_user_id = b64decode(user_id_key)
            bytes_version = b64decode(version_key)
        except B64DecodeError:
            return None
        
        try:
            string_user_id = bytes_user_id.decode()
            string_version = bytes_version.decode()
        except UnicodeDecodeError:
            return None
        
        try:
            user_id = int(string_user_id)
            version = int(string_version)
        except ValueError:
            return None
        
        return cls(user_id, version, value)
    
    
    def __str__(self):
        cached = self._cached
        if cached is None:
            cached = self._stringify()
            self._cached = cached
        
        return cached
    
    
    def _stringify(self):
        user_id_key = b64encode(str(self.user_id).encode()).decode()
        version_key = b64encode(str(self.version).encode()).decode()
        value_key = b64encode(self.value).decode()
        return f'{user_id_key}.{version_key}.{value_key}'
    
    
    def __repr__(self):
        return ''.join([
            '<',
            self.__class__.__name__,
            ' user_id=',
            repr(self.user_id),
            ', created_at=',
            self.created_at.__format__(DATETIME_FORMAT_CODE),
            ', value=',
            repr(self.value),
        ])
    
    
    @property
    def created_at(self):
        return id_to_datetime(self.version)
    
    
    def __eq__(self, other):
        if type(self) is not type(other):
            return NotImplemented
        
        if self.user_id != other.user_id:
            return False
        
        if self.version != other.version:
            return False
        
        if self.value != other.value:
            return False
        
        return True
