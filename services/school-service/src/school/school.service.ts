import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School, SchoolStatus } from './entities/school.entity';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger(SchoolService.name);

  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.schoolRepository.createQueryBuilder('school');

    if (status) {
      queryBuilder.where('school.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(school.name ILIKE :search OR school.email ILIKE :search OR school.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const school = await this.schoolRepository.findOne({
      where: { id },
      relations: ['classes', 'classes.sections'],
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }

  async create(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepository.create({
      ...createSchoolDto,
      status: SchoolStatus.PENDING,
    });

    const savedSchool = await this.schoolRepository.save(school);
    this.logger.log(`School created: ${savedSchool.id}`);
    return savedSchool;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto) {
    const school = await this.findOne(id);
    Object.assign(school, updateSchoolDto);
    const updatedSchool = await this.schoolRepository.save(school);
    this.logger.log(`School updated: ${id}`);
    return updatedSchool;
  }

  async approve(id: string) {
    const school = await this.findOne(id);
    school.status = SchoolStatus.APPROVED;
    const updatedSchool = await this.schoolRepository.save(school);
    this.logger.log(`School approved: ${id}`);
    return updatedSchool;
  }

  async suspend(id: string) {
    const school = await this.findOne(id);
    school.status = SchoolStatus.SUSPENDED;
    const updatedSchool = await this.schoolRepository.save(school);
    this.logger.log(`School suspended: ${id}`);
    return updatedSchool;
  }
}
