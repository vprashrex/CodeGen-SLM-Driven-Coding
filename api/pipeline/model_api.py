import os
from ctransformers import AutoModelForCausalLM, AutoConfig
from dataclasses import dataclass,asdict
import concurrent.futures

@dataclass
class GenerationConfig:
    temperature: float
    top_k: int
    top_p: float
    repetition_penalty: float
    max_new_tokens: int
    seed: int
    reset: bool
    stream: bool
    threads: int
    stop: list

class ModelsPath:
    CODE_GEN_MODEL = "./models/instruct/replit-v2-codeinstruct-3b.q4_1.bin"


class CodeGen:
    MAX_LENGTH = 2048

    def __init__(self):
        self.model = None

    def format_prompt(self, user_prompt: str):
        return '''
            You are a coding bot with a stringent focus on programming-related queries. Your task is to provide detailed and accurate responses to questions related to coding languages, algorithms, data structures, and software development. Exclude non-coding topics entirely, ensuring the model refrains from responding to any queries outside the realm of programming. Emphasize precision and depth in coding-related answers while filtering out unrelated information.
            ### Instruction:
            {}
            ### Response:
            '''.format(user_prompt.strip()).lstrip()

    # GENERATE WORD WITH TIMEOUT_CONDITION
    def generate(self,llm: AutoModelForCausalLM,generation_config: GenerationConfig,user_prompt:str):
        return llm(
            self.format_prompt(user_prompt),
            **asdict(generation_config)
        )
    
    def initliaze_model(self):
        if self.model is None:
            config = AutoConfig.from_pretrained(os.path.abspath("./models/instruct/"),context_length=self.MAX_LENGTH)
            self.model = AutoModelForCausalLM.from_pretrained(
                ModelsPath.CODE_GEN_MODEL,
                model_type="replit",
                config=config
            )

    def infer(self,user_prompt:str):
        self.initliaze_model()
        generation_config = GenerationConfig(
            temperature=0.2,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.0,
            max_new_tokens=512,
            seed=42,
            reset=False, 
            stream=True, 
            threads=int(os.cpu_count() / 6),
            stop=["<|endoftext|>"],
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
            print(word,end="",flush=True)
        print("")
    except Exception as e:
        print(e)