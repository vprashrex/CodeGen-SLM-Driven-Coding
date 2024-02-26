import os
from dataclasses import dataclass, asdict
from llama_cpp import Llama

@dataclass
class GenerationConfig:
    temperature: float
    top_k: int
    top_p: float
    stream: bool
    max_tokens:int
    echo:bool
    stop: list[str]
    repeat_penalty:float


def format_prompt(user_prompt: str):
    return f'''
      You are an AI programming assistant, utilizing the Deepseek Coder model, developed by Deepseek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer.\n### Instruction:\n{user_prompt}\n### Response:
    '''


def generate(
    llm: Llama,
    generation_config: GenerationConfig,
    user_prompt: str,
):
    """run model inference, will return a Generator if streaming is true"""

    return llm(
        format_prompt(
            user_prompt,
        ),
        **asdict(generation_config),
    )


if __name__ == "__main__":

    llm = Llama(
        os.path.abspath("./models/instruct/instruct.Q4_K.gguf"),
        context_length=2048
    )

    generation_config = GenerationConfig(
        max_tokens=512,
        temperature=0.1,
        top_k=50,
        top_p=0.95,
        echo=True,
        stop=["<|EOT|>"],
        stream=True,
        repeat_penalty=1.1,
    )

    user_prefix = "[user]: "
    assistant_prefix = f"[assistant]:"

    while True:
        user_prompt = input(user_prefix)
        generator = generate(llm, generation_config, user_prompt.strip())
        print(assistant_prefix, end=" ", flush=True)
        for word in generator:
            print(word["choices"][0]["text"], end="", flush=True)
        print("")