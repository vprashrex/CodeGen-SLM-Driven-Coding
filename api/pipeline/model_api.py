from llama_cpp import Llama
from dataclasses import dataclass,asdict
from transformers import AutoTokenizer
import os

@dataclass
class GenerationConfig:
    temperature: float
    seed: int
    top_k: int
    top_p: float
    stream: bool
    max_tokens:int
    repeat_penalty:float
    stop:list

class ModelsPath:
    CODE_GEN_MODEL = os.path.abspath("./models/instruct/instruct-chat.Q4_K_M.gguf")


class CodeGen:
    MAX_LENGTH = 2048

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/deepseek-coder-6.7b-instruct", trust_remote_code=True)
        self.model = None

    def format_prompt(self,user_prompt: str):
        messages=[
            { 'role': 'user', 'content': user_prompt}
            ]
        
        inputs = self.tokenizer.apply_chat_template(messages, add_generation_prompt=True)

        return inputs

    # GENERATE WORD WITH TIMEOUT_CONDITION
    def generate(self,llm: Llama,generation_config: GenerationConfig,user_prompt:str):
        return llm(
            self.format_prompt(user_prompt),
            **asdict(generation_config)
        )
    
    def initliaze_model(self):
        if self.model is None:
            self.model = Llama(
                model_path=ModelsPath.CODE_GEN_MODEL,
                n_ctx=2048,
                verbose=False
            )

    def infer(self,user_prompt:str):
        self.initliaze_model()
        generation_config = GenerationConfig(
            max_tokens=512,
            temperature=0.7,
            top_k=50,
            top_p=0.9,
            stream=True,
            repeat_penalty=1.0,
            seed=42,
            stop=["<|EOT|>"]
        )
        gen_word = self.generate(self.model,generation_config,user_prompt)

        return gen_word

    def __iter__(self):
        if not self.model:
            raise StopIteration
        else:
            for word in self.model:
                yield  word

if __name__ == '__main__':
    try:

        code_gen = CodeGen()        
        user_prefix = "[user]: "
        assistant_prefix = "[assistant]: "
        while True:
            user_prompt = input(user_prefix)
            gen_word = code_gen.infer(user_prompt)
            print(assistant_prefix, end="", flush=True)
            for word in gen_word:
                print(word["choices"][0]["text"],end="",flush=True)
            print("")
    except Exception as e:
        print(e)