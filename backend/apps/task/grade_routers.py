from fastapi import APIRouter, Body, Request, status, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List

from apps.task import user_models
from .user_models import (
    AssignmentModel,
    StudentGradeModel,
    StudentModel,
    UserModel,
    Message,
)

router = APIRouter()


@router.post(
    "/lectures/{lid}/students/{sid}/grades",
    response_description="Add new grade into a student",
    operation_id="createGrade",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
        400: {"model": Message},
    },
)
async def create_grade(
    lid: str,
    sid: str,
    request: Request,
    grade: StudentGradeModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Create a grades for a semester with given userID, semesterID"""

    grade = jsonable_encoder(grade)

    if auth_user:
        update_result = await request.app.mongodb["users"].update_one(
            {"lectures._id": lid, "lectures.students.number": sid},
            {
                "$push": {
                    "lectures.$[i].students.$[j].grades": grade,
                }
            },
            array_filters=[{"i._id": lid}, {"j.number": sid}],
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Grade created"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Grade not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/lectures/{lid}/students/{sid}/grades",
    response_description="List all grades of a student",
    operation_id="listGradesOfStudent",
    response_model=List[StudentGradeModel],
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def list_grades(
    lid: str,
    sid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """List all gradess of a student with given userID, lectureID"""

    if auth_user:
        if (
            user := await request.app.mongodb["users"].find_one({"lectures._id": lid})
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    for student in lecture["students"]:
                        if student["number"] == sid:
                            return student["grades"]

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Grades not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.get(
    "/lectures/{lid}/students/{sid}/grades/{aid}",
    response_description="Get a single grade of a student",
    operation_id="getSingleGrade",
    response_model=StudentGradeModel,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def show_grade(
    lid: str,
    aid: str,
    sid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Get a single assignment with given userID, lectureID and assignmentID"""

    if auth_user:
        if (
            user := await request.app.mongodb["users"].find_one(
                {
                    "lectures._id": lid,
                    "lectures.students.number": sid,
                }
            )
        ) is not None:
            for lecture in user["lectures"]:
                if lecture["_id"] == lid:
                    for student in lecture["students"]:
                        if student["number"] == sid:
                            for grade in student["grades"]:
                                if grade["assignment_id"] == aid:
                                    return grade

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Grade not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.put(
    "/lectures/{lid}/students/{sid}/grades/{gid}",
    response_description="Update a grade",
    operation_id="updateGrade",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def update_grade(
    lid: str,
    sid: str,
    gid: str,
    request: Request,
    grade: StudentGradeModel = Body(...),
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Update an grade with given userID, lectureID and gradeID"""

    grade = {k: v for k, v in grade.dict().items() if v is not None}
    grade = jsonable_encoder(grade)

    if auth_user:
        if len(grade) >= 1:
            update_result = await request.app.mongodb["users"].update_many(
                {
                    "lectures._id": lid,
                    "lectures.students.number": sid,
                    "lectures.students.grades._id": gid,
                },
                {
                    "$set": {
                        "lectures.$[i].students.$[j].grades.$[k].assignment_name": grade[
                            "assignment_name"
                        ],
                        "lectures.$[i].students.$[j].grades.$[k].assignment_id": grade[
                            "assignment_id"
                        ],
                        "lectures.$[i].students.$[j].grades.$[k].scores": grade[
                            "scores"
                        ],
                    }
                },
                array_filters=[{"i._id": lid}, {"j._id": sid}, {"k._id": gid}],
            )

            if update_result.modified_count == 1:
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={"message": "Grade updated"},
                )

            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Grade not found"},
            )

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "Invalid input"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )


@router.delete(
    "/lectures/{lid}/students/{sid}/grades/{gid}",
    response_description="Delete grade",
    operation_id="deleteGrade",
    response_model=Message,
    responses={
        404: {"model": Message},
        403: {"model": Message},
        401: {"model": Message},
    },
)
async def delete_grade(
    lid: str,
    sid: str,
    gid: str,
    request: Request,
    auth_user: UserModel = Depends(user_models.get_current_user),
):
    """Delete an student with given userID, lectureID and studentID"""

    if auth_user:
        update_result = await request.app.mongodb["users"].update_one(
            {
                "lectures._id": lid,
                "lectures.students._id": sid,
                "lectures.students.grades._id": gid,
            },
            {
                "$pull": {
                    "lectures.$[i].students.$[j].grades": {"_id": gid},
                }
            },
            array_filters=[{"i._id": lid}, {"j._id": sid}],
        )

        if update_result.modified_count == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "Grade deleted"},
            )

        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Grade not found"},
        )

    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN, content={"message": "No right to access"}
    )