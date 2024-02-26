from llama_cpp import Llama
from dataclasses import dataclass,asdict

@dataclass
class GenerationConfig:
    temperature: float
    top_k: int
    top_p: float
    stream: bool
    max_tokens:int
    echo:bool
    stop: list
    repeat_penalty:float

class ModelsPath:
    CODE_GEN_MODEL = "./models/instruct/instruct.Q4_K.gguf"


class CodeGen:
    MAX_LENGTH = 2048

    def __init__(self):
        self.model = None

    def format_prompt(self,user_prompt: str):
        return f'''
            You are an AI programming assistant, utilizing the Deepseek Coder model, developed by Deepseek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer.\n### Instruction:\n{user_prompt}\n### Response:
        '''

    # GENERATE WORD WITH TIMEOUT_CONDITION
    def generate(self,llm: Llama,generation_config: GenerationConfig,user_prompt:str):
        return llm(
            self.format_prompt(user_prompt),
            **asdict(generation_config)
        )
    
    def initliaze_model(self):
        if self.model is None:
            self.model = Llama(
                ModelsPath.CODE_GEN_MODEL
            )

    def infer(self,user_prompt:str):
        self.initliaze_model()
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
        gen_word = self.generate(self.model,generation_config,user_prompt.strip())

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
        gen_word = code_gen.infer("print hello world")
        for word in gen_word:
            print(word["choices"][0]["text"],end="",flush=True)
        print("")
    except Exception as e:
        print(e)