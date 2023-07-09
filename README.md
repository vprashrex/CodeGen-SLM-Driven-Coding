## CodeGen v1.1

# how to update the submodule of pic.ai-v2.1

FIRST cd into alina-code
```sh
cd alina-code
```

NEXT update the submodule
```sh
git submodule update --init 
```



:triangular_flag_on_post: **Updates**

- :white_check_mark: Added server.py script for inferencing the CodeGen on web
- :white_check_mark: Updated Dockerfile && docker-compose.yml to run the webapplication easily 
- :white_check_mark: removed dead code in ctransformer module


## Setup

# Step one with python locally

First create a venv.

```sh
python -m venv env && source env/bin/activate
```

Next update the ctransformer submodule
```sh
git submodule update --init 
```

Next install the requirements
```sh
pip install -r requirements.txt
```

Next download the model weight 

```sh
python download_model.py
```

Now run the server.py

```sh
uvicorn server:app --reload
```

# Run using Docker

