import random

responses = {
    "hello": ["Hi there! How are you feeling?", "Hello! How’s your day going?"],
    "sad": ["I’m sorry you’re feeling this way. Want to talk about it?", "It’s okay to feel sad. I’m here for you."],
    "angry": ["I see you’re feeling angry. What happened?", "Anger is normal. Want some relaxation tips?"],
    "frustrated": ["I get it, things can be tough. Do you want some relaxation tips?", "Take a deep breath. What’s causing this frustration?"],
    "bye": ["Take care! You’re not alone.", "Goodbye! Stay strong."]
}

conversation_memory = []  # This will store previous user inputs

def chatbot_response(user_input):
    conversation_memory.append(user_input)  # Store past conversation
    user_input = user_input.lower()

    for key in responses:
        if key in user_input:
            return random.choice(responses[key])

    # If no specific response, reflect on past conversation
    if len(conversation_memory) > 3:
        return f"You mentioned '{conversation_memory[-2]}' earlier. Want to talk more about that?"
    
    return "I’m here to listen. Tell me more."

# Chat loop
print("Chatbot: Hi! I’m here to talk. Type 'bye' to exit.")
while True:
    user_input = input("You: ")
    if user_input.lower() == "bye":
        print("Chatbot: Take care! Goodbye.")
        break
    print("Chatbot:", chatbot_response(user_input))