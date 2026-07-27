
export class SnippetResponseDTO{

    id!: number;

    title!: string;

    description!:string;

    code!: string;

    language!: string;

    tags!: string[];

    shareToken!: number;

    versions!: number;

    createdAt!: Date;

    updatedAt!: Date;
}