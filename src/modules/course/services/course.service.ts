import BaseService from "../../base/base.service";
import { Course, ICourse } from "../models/course.model";

class CourseService extends BaseService<ICourse> {
  constructor() {
    super(Course);
  }

  async getAllCoursesWithRemainingCapacity(): Promise<any[]> {
    return Course.aggregate([
      {
        $lookup: {
          from: "bookings", // The name of the Booking collection
          localField: "_id",
          foreignField: "course",
          as: "bookings",
        },
      },
      {
        $lookup: {
          from: "members", // The name of the User collection
          localField: "bookings.member",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $addFields: {
          totalBookings: { $size: "$bookings" }, // Count how many bookings exist for this course
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          capacity: 1,
          totalBookings: 1,
          members: 1,
          remainingCapacity: { $subtract: ["$capacity", "$totalBookings"] }, // Calculate remaining capacity
        },
      },
    ]);
  }

  async findByEmail(email: string): Promise<ICourse | null> {
    return this.model.findOne({ email }).exec();
  }
}

export default CourseService;
