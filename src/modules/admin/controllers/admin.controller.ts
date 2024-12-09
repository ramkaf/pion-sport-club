import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../../../common/utils/ResponseHandler";
import MemberService from "../../../modules/member/services/member.service";
import CourseService from "../../../modules/course/services/course.service";
import BookingService from "../../../modules/booking/services/booking.service";
import {handleAction} from '../../../../common/utils/ResponseHandler'

class AdminController {
  private memberService: MemberService;
  private courseService: CourseService;
  private bookingService: BookingService;

  constructor() {
    this.memberService = new MemberService();
    this.courseService = new CourseService();
    this.bookingService = new BookingService();
  }



  // Create a new member
  createMember = async (req: Request, res: Response): Promise<void> => {
    handleAction(
      () => this.memberService.create({ ...req.body }),
      "Member created successfully",
      "Error creating member",
      res
    );
  };

  // Update member details
  updateMember = async (req: Request, res: Response): Promise<void> => {
    const { id, ...rest } = req.body;
    handleAction(
      () => this.memberService.update(id, rest),
      "Member updated successfully",
      "Error updating member",
      res
    );
  };

  // Upgrade member role to admin
  upgradeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    try {
      const upgradedMember = await this.memberService.updateRoleToAdmin(id);
      return ResponseHandler.success(
        res,
        upgradedMember,
        "Member upgraded to admin successfully"
      );
    } catch (error) {
      next(error); // Passing error to the error handler middleware
    }
  };

  // Get a member with their courses by member ID
  getMemberWithTheirCourse = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    handleAction(
      () => this.memberService.getMemberWithCoursesById(id),
      "Member with their courses retrieved successfully",
      "Error fetching member with courses",
      res
    );
  };

  // Get all members with their courses
  getAllMembersWithTheirCourses = async (req: Request, res: Response): Promise<void> => {
    handleAction(
      () => this.memberService.getAllMembersWithTheirCourse(),
      "Members with their courses retrieved successfully",
      "Error fetching members with courses",
      res
    );
  };

  // Get all courses with their members
  getAllCourseWithTheirMembers = async (req: Request, res: Response): Promise<void> => {
    handleAction(
      () => this.courseService.getAllCoursesWithRemainingCapacity(),
      "Courses with their members retrieved successfully",
      "Error fetching courses with members",
      res
    );
  };

  // Remove a member by ID
  removeMember = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    handleAction(
      () => this.memberService.delete(id),
      "Member removed successfully",
      "Error removing member",
      res
    );
  };

  // Create a booking for a member
  booking = async (req: Request, res: Response): Promise<void> => {
    handleAction(
      () => this.bookingService.create({ ...req.body }),
      "Booking created successfully",
      "Error creating booking",
      res
    );
  };

  // Cancel a booking for a member
  unBooking = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    handleAction(
      () => this.bookingService.delete(id),
      "Booking canceled successfully",
      "Error canceling booking",
      res
    );
  };
}

export default AdminController;
