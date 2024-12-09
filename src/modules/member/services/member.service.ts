import mongoose from "mongoose";
import { NotFoundError } from "../../../../common/errors/AppError";
import BaseService from "../../base/base.service";
import { IMember, Member, Role } from "../models/member.model";

class MemberService extends BaseService<IMember> {
  constructor() {
    super(Member);
  }
  async getAllMembersWithTheirCourse(): Promise<any[]> {
    const memberWithCourses = await Member.aggregate([
        {
            $lookup: {
                from: "bookings",
                localField: "_id",
                foreignField: "member",
                as: "bookedCourses"
            }
        },
        {
            $unwind: {
                path: "$bookedCourses",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "bookedCourses.course",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $unwind: {
                path: "$courseDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                firstname: { $first: "$firstname" },
                lastname: { $first: "$lastname" },
                email: { $first: "$email" },
                courses: {
                    $push: {
                        $cond: {
                            if: { $ne: ["$courseDetails", null] },
                            then: {
                                title: "$courseDetails.title",
                                description: "$courseDetails.description"
                            },
                            else: "$$REMOVE" // Use $$REMOVE to avoid pushing anything when courseDetails is null
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                courses: {
                    $filter: {
                        input: "$courses",
                        as: "course",
                        cond: { $ne: ["$$course", null] } // Filter out null values
                    }
                }
            }
        }
    ]);

    return memberWithCourses;
}
async getMemberWithCoursesById(memberId: string): Promise<any> {
    const memberWithCourses = await Member.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(memberId) // Match the specific member ID
            }
        },
        {
            $lookup: {
                from: "bookings",
                localField: "_id",
                foreignField: "member",
                as: "bookedCourses"
            }
        },
        {
            $unwind: {
                path: "$bookedCourses",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "courses",
                localField: "bookedCourses.course",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $unwind: {
                path: "$courseDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                firstname: { $first: "$firstname" },
                lastname: { $first: "$lastname" },
                email: { $first: "$email" },
                courses: {
                    $push: {
                        $cond: {
                            if: { $ne: ["$courseDetails", null] },
                            then: {
                                title: "$courseDetails.title",
                                description: "$courseDetails.description"
                            },
                            else: "$$REMOVE" // Use $$REMOVE to avoid pushing anything when courseDetails is null
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                firstname: 1,
                lastname: 1,
                email: 1,
                courses: {
                    $filter: {
                        input: "$courses",
                        as: "course",
                        cond: { $ne: ["$$course", null] } // Filter out null values
                    }
                }
            }
        }
    ]);

    return memberWithCourses.length > 0 ? memberWithCourses[0] : null; // Return the first member or null if not found
}

  async findByEmail(email: string): Promise<IMember | null> {
    return this.model.findOne({ email }).exec();
  }

  async updateRoleToAdmin(id: string): Promise<IMember | null> {
      const member = await Member.findByIdAndUpdate(id, { role: Role.ADMIN } , {new : true});
      if (!member)
        throw new NotFoundError('no memebr found with that id')
      return member;
  }
}

export default MemberService;
