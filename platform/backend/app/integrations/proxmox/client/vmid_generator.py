import random

class VMIDGenerator:
    @staticmethod
    def generate():
        return random.randint(200, 9999)
