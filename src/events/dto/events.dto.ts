import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { EventCategory } from 'src/common/entities/event.entity';
import { FindAllOrderBy } from '../services/eventsServices.service';

export class GetEventsDto {
  @IsEnum(FindAllOrderBy)
  public orderBy: string;

  @IsOptional()
  @IsDateString()
  public laterThan?: string;

  @IsOptional()
  @IsEnum(EventCategory)
  public category?: string;

  @IsOptional()
  public name?: string;

  @IsInt()
  @Type(() => Number)
  public pageNumber: string;

  @IsInt()
  @Type(() => Number)
  public contentPerPage: string;
}

export class PostEventDto {
  public name: string;

  @IsEnum(EventCategory)
  public category: string;

  public description: string;

  public location: string;

  @IsDateString()
  public startTime: string;

  @IsDateString()
  public endTime: string;

  @IsUrl()
  public imageUrl: string;
}

export class PutEventDto {
  public name?: string;

  @IsEnum(EventCategory)
  public category?: string;

  public description?: string;

  public location?: string;

  @IsDateString()
  public startTime?: string;

  @IsDateString()
  public endTime?: string;

  @IsUrl()
  public imageUrl?: string;
}
