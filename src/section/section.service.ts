import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import { PrismaError } from 'prisma-error-enum';
import { MyBadRequestException } from 'src/general/error-handling/exceptions/my-bad-request.exception';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { CreateSectionInput } from './dto/create-section.input';
import { SectionReturnType } from './section.types';

@Injectable()
export class SectionService {
	constructor(private readonly prisma: PrismaService) {}

	async getSections(courseId: string): Promise<SectionReturnType[]> {
		try {
			const sections = await this.prisma.section.findMany({
				where: {
					courseId
				},
				orderBy: {
					createdAt: 'asc'
				}
			});

			return sections;
		} catch (e) {
			throw new InternalServerErrorException();
		}
	}

	async createSection(
		universityId: string,
		data: CreateSectionInput
	): Promise<SectionReturnType> {
		try {
			const section = await this.prisma.section.create({
				data: {
					...data,
					universityId
				}
			});

			return section;
		} catch (e) {
			if (e.code === PrismaError.ForeignConstraintViolation) {
				throw new MyBadRequestException({
					univeristy: 'This university doesn"t exist anymore'
				});
			} else if (
				e.code === PrismaError.UniqueConstraintViolation &&
				e.meta.target.includes('name')
			) {
				throw new MyBadRequestException({
					name:
						'There is already a section with the same name in this course'
				});
			}

			throw new InternalServerErrorException();
		}
	}

	async updateSection(
		universityId: string,
		id: string,
		data: CreateSectionInput
	): Promise<SectionReturnType> {
		try {
			const section = await this.prisma.section.update({
				where: {
					id_universityId: {
						id,
						universityId
					}
				},
				data
			});

			return section;
		} catch (e) {
			if (
				e.code === PrismaError.UniqueConstraintViolation &&
				e.meta.target.includes('name')
			) {
				throw new MyBadRequestException({
					name:
						'There is already a section with the same name in this course'
				});
			} else if (e.code === 'P2025') {
				throw new NotFoundException();
			}

			throw new InternalServerErrorException();
		}
	}

	async deleteSection(
		universityId: string,
		id: string
	): Promise<SectionReturnType> {
		try {
			const relatedActivities = {
				where: {
					sectionId: id
				}
			};
			const activities = await this.prisma.activity.findMany(
				relatedActivities
			);
			const relatedSpecificActivities = {
				where: {
					activityId: {
						in: activities.map((a) => a.id)
					}
				}
			};
			await this.prisma.$transaction([
				this.prisma.resource.deleteMany(relatedSpecificActivities),
				this.prisma.assignment.deleteMany(relatedSpecificActivities),
				this.prisma.quiz.deleteMany(relatedSpecificActivities),
				this.prisma.activity.deleteMany(relatedActivities)
			]);
			const section = await this.prisma.section.delete({
				where: {
					id_universityId: {
						id,
						universityId
					}
				}
			});

			return section;
		} catch (e) {
			if (e.code === 'P2025') {
				throw new NotFoundException();
			}

			throw new InternalServerErrorException();
		}
	}
}
