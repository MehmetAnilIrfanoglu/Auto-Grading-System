from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status, Request, Depends
from typing import Optional, List, Dict
import uuid
from pydantic import BaseModel, Field, EmailStr
from datetime import timedelta, datetime
from passlib.context import CryptContext
from jose import JWTError, jwt

SECRET_KEY = "c8fc6e033c9801ca3c7d580dfd4756d691b96b3c8cc6e2313723eb49d7bc5384"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class StudentGradeModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    assignment_name: str = Field(...)
    assignment_id: str = Field(...)
    scores: List[int] = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "assignment_name": "Assignment 3",
                "assignment_id": "132156464",
                "scores": [2, 0],
            }
        }


class StudentModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    number: str = Field(...)
    grades: List[StudentGradeModel] = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "name": "John",
                "number": "110510148",
            }
        }


class AssignmentModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    inputs: List[str] = Field(...)
    outputs: List[str] = Field(...)
    scores: List[int] = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "name": "Assignment 3",
                "inputs": ["abs", "sdfsdf"],
                "outputs": ["asdassf", "sjkdfhgskjdf"],
                "scores": [2, 3],
            }
        }


class LectureModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    assignments: List[AssignmentModel] = []
    students: List[StudentModel] = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "name": "COMP202",
            }
        }


class UserModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: EmailStr = Field(...)
    password: str = Field(...)
    lectures: List[LectureModel] = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "hello@agu.edu.tr",
                "password": "hello1234",
            }
        }


class UserAPIModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: Optional[EmailStr]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "c765c307-560c-47ab-b29e-0a1265eab860",
                "email": "hello@agu.edu.tr",
                "userGroup": "default",
            }
        }


class UpdatePasswordModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    password: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "password": "123456",
            }
        }


class Message(BaseModel):
    message: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(request: Request, username: str, password: str):
    user = await request.app.mongodb["users"].find_one({"email": username})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await request.app.mongodb["users"].find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return user
