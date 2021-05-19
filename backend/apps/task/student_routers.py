from fastapi import APIRouter, Body, Request, status, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List

from apps.task import user_models
from .user_models import (
    StudentModel,
    UserModel,
    Message,
)

router = APIRouter()


@router.post(
    "/{uid}/lectures/{lid}/students",
    response_description="Add new student into a lecture",
    operation_id="createStudent",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
        400: {"model": Message},
    },
)
async def create_student(
    uid: str,
    lid: str,
    request: Request,
    student: StudentModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Create a students for a semester with given userID, semesterID"""

    student = jsonable_encoder(student)

    if auth_user["_id"] == uid:
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid, "lectures._id": lid},
            {"$push": {"lectures.$.students": student}},
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Student created"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Student not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures/{lid}/students",
    response_description="List all students of a lecture",
    operation_id="listStudentsOfLecture",
    response_model=List[StudentModel],
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def list_students(
    uid: str,
    lid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """List all students of a lecture with given userID, lectureID"""

    if auth_user["_id"] == uid:
        if (
            user := await request.app.mongodb["users"].find_one(
                {"_id": uid, "lectures._id": lid}
            )
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    return lecture["students"]

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Lecture not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures/{lid}/students/{sid}",
    response_description="Get a single student of a lecture",
    operation_id="getSingleStudent",
    response_model=StudentModel,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def show_student(
    uid: str,
    lid: str,
    sid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Get a single assignment with given userID, lectureID and assignmentID"""

    if auth_user["_id"] == uid:
        if (
            user := await request.app.mongodb["users"].find_one(
                {
                    "_id": uid,
                    "lectures._id": lid,
                    "lectures.students._id": sid,
                }
            )
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    for student in lecture["students"]:
                        if student["_id"] == sid:
                            return student

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Student not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.put(
    "/{uid}/lectures/{lid}/students/{sid}",
    response_description="Update a student",
    operation_id="updateStudent",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def update_student(
    uid: str,
    lid: str,
    sid: str,
    request: Request,
    student: StudentModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Update an student with given userID, lectureID and studentID"""

    student = {k: v for k, v in student.dict().items() if v is not None}
    student = jsonable_encoder(student)

    if auth_user["_id"] == uid:
        if len(student) >= 1:
            update_result = await request.app.mongodb["users"].update_many(
                {
                    "_id": uid,
                    "lectures._id": lid,
                    "lectures.students._id": sid,
                },
                {
                    "$set": {
                        "lectures.$[i].students.$[j].name": student["name"],
                        "lectures.$[i].students.$[j].number": student["number"],
                    }
                },
                array_filters=[{"i._id": lid}, {"j._id": sid}],
            )

            if update_result.modified_count == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message": "Student updated"},
                )

            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Student not found"},
            )

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid input"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.delete(
    "/{uid}/lectures/{lid}/students/{sid}",
    response_description="Delete student",
    operation_id="deleteStudent",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def delete_student(
    uid: str,
    lid: str,
    sid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Delete an student with given userID, lectureID and studentID"""

    if auth_user["_id"] == uid:
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid, "lectures._id": lid},
            {"$pull": {"lectures.$.students": {"_id": sid}}},
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Student deleted"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Student not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )