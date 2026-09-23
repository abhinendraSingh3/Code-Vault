import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AskAiDto {

  @IsInt()
  snippetId!: number;

  @IsOptional()
  @IsInt()
  versionId?: number;

  @IsString()
  @IsNotEmpty()
  prompt!: string;
}