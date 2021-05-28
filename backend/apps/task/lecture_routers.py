from fastapi import APIRouter, Body, Request, status, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List


from apps.task import user_models
from .user_models import (
    UserModel,
    LectureModel,
    Message,
)

router = APIRouter()


@router.post(
    "/{uid}/lectures",
    response_description="Add new lecture",
    operation_id="createLecture",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
        400: {"model": Message},
    },
)
async def create_lecture(
    uid: str,
    request: Request,
    lecture: LectureModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Create a lecture for a user with given userID"""

    lecture = jsonable_encoder(lecture)

    if auth_user["_id"] == uid and auth_user["user_group"] == "instructor":
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid}, {"$push": {"lectures": lecture}}
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Lecture created"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "User not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures",
    response_description="List all lectures",
    operation_id="listLectures",
    response_model=List[LectureModel],
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def list_lectures(
    uid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """list all lectures"""
    if auth_user["_id"] == uid:
        lectures = []
        for doc in await request.app.mongodb["users"].find().to_list(length=100):
            if doc["user_group"] == "instructor":
                for lecture in doc["lectures"]:
                    lectures.append(lecture)

        return lectures

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures/{lid}",
    response_description="Get a single lecture",
    operation_id="getSingleLecture",
    response_model=LectureModel,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def show_lecture(
    uid: str,
    lid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Get a single lecture with given userID and lectureID"""

    if auth_user["_id"] == uid:
        if auth_user["user_group"] == "instructor":
            for lecture in auth_user["lectures"]:
                if lecture["_id"] == lid:
                    return lecture

            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Lecture not found"},
            )
        else:
            if (
                user := await request.app.mongodb["users"].find_one(
                    {"lectures._id": lid}
                )
            ) is not None:
                for lecture in user["lectures"]:
                    if lecture["_id"] == lid:
                        for student in lecture["students"]:
                            if student["number"] == auth_user["number"]:
                                return lecture

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.put(
    "/{uid}/lectures/{lid}",
    response_description="Update a lecture",
    operation_id="updateLecture",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def update_lecture(
    uid: str,
    lid: str,
    request: Request,
    lecture: LectureModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Update a lecture with given userID and lectureID"""

    lecture = {k: v for k, v in lecture.dict().items() if v is not None}
    lecture = jsonable_encoder(lecture)

    if auth_user["_id"] == uid and auth_user["user_group"] == "instructor":
        if len(lecture) >= 1:
            update_result = await request.app.mongodb["users"].update_one(
                {"_id": uid, "lectures._id": lid},
                {
                    "$set": {
                        "lectures.$.name": lecture["name"],
                    }
                },
            )

            if update_result.modified_count == 1:
                return JSONResponse(
                    status_code=status.HTTP_404_NOT_FOUND,
                    content={"message": "Lecture updated"},
                )

            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Lecture couldn't be updated"},
            )

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid input"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.delete(
    "/{uid}/lectures/{lid}",
    response_description="Delete lecture",
    operation_id="deleteLecture",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
        400: {"model": Message},
    },
)
async def delete_lecture(
    uid: str,
    lid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Delete a lecture with given userID and lectureID"""

    if auth_user["_id"] == uid and auth_user["user_group"] == "instructor":
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid}, {"$pull": {"lectures": {"_id": lid}}}
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Lecture deleted"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Lecture not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )