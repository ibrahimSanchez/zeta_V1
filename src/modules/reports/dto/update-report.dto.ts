import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
