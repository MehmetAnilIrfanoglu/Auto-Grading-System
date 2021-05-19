from fastapi import APIRouter, Body, Request, status, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List

from apps.task import user_models
from .user_models import (
    AssignmentModel,
    UserModel,
    Message,
)

router = APIRouter()


@router.post(
    "/{uid}/lectures/{lid}/assignments",
    response_description="Add new assignment into a lecture",
    operation_id="createAssignment",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
        400: {"model": Message},
    },
)
async def create_assignment(
    uid: str,
    lid: str,
    request: Request,
    assignment: AssignmentModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Create a assignments for a semester with given userID, semesterID"""

    assignment = jsonable_encoder(assignment)

    if auth_user["_id"] == uid:
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid, "lectures._id": lid},
            {"$push": {"lectures.$.assignments": assignment}},
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Assignment created"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Assignment not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures/{lid}/assignments",
    response_description="List all assignments of a lecture",
    operation_id="listAssignmentsOfLecture",
    response_model=List[AssignmentModel],
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def list_assignments(
    uid: str,
    lid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """List all assignments of a lecture with given userID, lectureID"""

    if auth_user["_id"] == uid:
        if (
            user := await request.app.mongodb["users"].find_one(
                {"_id": uid, "lectures._id": lid}
            )
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    return lecture["assignments"]

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Assignment not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/{uid}/lectures/{lid}/lessons/{aid}",
    response_description="Get a single lesson of a semester",
    operation_id="getSingleLesson",
    response_model=AssignmentModel,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def show_assignment(
    uid: str,
    lid: str,
    aid: str,
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
                    "lectures.assignments._id": aid,
                }
            )
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    for assignment in lecture["assignments"]:
                        if assignment["_id"] == aid:
                            return assignment

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Assignment not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.put(
    "/{uid}/lectures/{lid}/assignments/{aid}",
    response_description="Update an assignment",
    operation_id="updateAssignment",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def update_assignment(
    uid: str,
    lid: str,
    aid: str,
    request: Request,
    assignment: AssignmentModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Update an assignment with given userID, lectureID and assignmentID"""

    assignment = {k: v for k, v in assignment.dict().items() if v is not None}
    assignment = jsonable_encoder(assignment)

    if auth_user["_id"] == uid:
        if len(assignment) >= 1:
            update_result = await request.app.mongodb["users"].update_many(
                {
                    "_id": uid,
                    "lectures._id": lid,
                    "lectures.assignments._id": aid,
                },
                {
                    "$set": {
                        "lectures.$[i].assignments.$[j].name": assignment["name"],
                        "lectures.$[i].assignments.$[j].inputs": assignment["inputs"],
                        "lectures.$[i].assignments.$[j].outputs": assignment["outputs"],
                        "lectures.$[i].assignments.$[j].scores": assignment["scores"],
                    }
                },
                array_filters=[{"i._id": lid}, {"j._id": aid}],
            )

            if update_result.modified_count == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message": "Assignment updated"},
                )

            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Assignment not found"},
            )

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid input"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.delete(
    "/{uid}/lectures/{lid}/assignments/{aid}",
    response_description="Delete assignment",
    operation_id="deleteAssignment",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def delete_assignment(
    uid: str,
    lid: str,
    aid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Delete an assignment with given userID, lectureID and assignmentID"""

    if auth_user["_id"] == uid:
        update_result = await request.app.mongodb["users"].update_one(
            {"_id": uid, "lectures._id": lid},
            {"$pull": {"lectures.$.assignments": {"_id": aid}}},
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Assignment deleted"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Assignment not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )