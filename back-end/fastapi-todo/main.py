from fastapi.middleware.cors import CORSMiddleware

import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import status

app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "cokgizlibiranahtarbuasirigizli"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class Task(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    completed: Optional[bool] = False
    due_date: Optional[datetime] = None
    priority: Optional[int] = None

class User(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


tasks: List[Task] = []
users: List[User] = []


tasks_file = Path("tasks.json")
users_file = Path("users.json")


if tasks_file.exists():
    try:
        with open(tasks_file, "r") as f:
            tasks_data = json.load(f)
            if isinstance(tasks_data, list):
                tasks = [Task(**task) for task in tasks_data]
    except json.JSONDecodeError:
        print("Error: tasks.json is not a valid JSON file.")


if users_file.exists():
    try:
        with open(users_file, "r") as f:
            users_data = json.load(f)
            if isinstance(users_data, list):
                users = [User(**user) for user in users_data]
    except json.JSONDecodeError:
        print("Error: users.json is not a valid JSON file.")
else:
    default_user = User(username="admin", password=pwd_context.hash("admin"))
    users.append(default_user)
    save_users()


def save_tasks():
    with open(tasks_file, "w") as f:
        json.dump([task.dict() for task in tasks], f, default=str)


def save_users():
    with open(users_file, "w") as f:
        json.dump([user.dict() for user in users], f, default=str)


def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(username=username)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = next((user for user in users if user.username == token_data.username), None)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@app.get("/")
def read_root():
    return {"message": "Burada işin yok senin, front-end'i kullan!"}


@app.post("/register/")
def register_user(user: User):
    if any(existing_user.username == user.username for existing_user in users):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, password=hashed_password)
    users.append(new_user)
    save_users()
    return {"message": "User registered successfully"}


@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = next((user for user in users if user.username == form_data.username), None)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/tasks/", response_model=Task)
def create_task(task: Task, user: User = Depends(get_current_user)):
    task_id = len(tasks) + 1
    task.id = task_id
    task.due_date = task.due_date or datetime.now()
    tasks.append(task)
    save_tasks()
    return task

@app.get("/tasks/", response_model=List[Task])
def get_tasks(completed: Optional[bool] = None, priority: Optional[int] = None, user: User = Depends(get_current_user)):
    filtered_tasks = tasks
    if completed is not None:
        filtered_tasks = [task for task in filtered_tasks if task.completed == completed]
    if priority is not None:
        filtered_tasks = [task for task in filtered_tasks if task.priority == priority]
    return filtered_tasks

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int, user: User = Depends(get_current_user)):
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task, user: User = Depends(get_current_user)):
    for existing_task in tasks:
        if existing_task.id == task_id:
            if updated_task.title is not None:
                existing_task.title = updated_task.title
            if updated_task.completed is not None:
                existing_task.completed = updated_task.completed
            if updated_task.due_date is not None:
                existing_task.due_date = updated_task.due_date
            if updated_task.priority is not None:
                existing_task.priority = updated_task.priority
            save_tasks()
            return existing_task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, user: User = Depends(get_current_user)):
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            save_tasks()
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
