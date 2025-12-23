import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Paginated } from '../dto/paginated';

interface ApiPaginatedOptions {
  description?: string;
  status?: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: ApiPaginatedOptions = {},
) => {
  const { description = 'Paginated response', status = 200 } = options;

  return applyDecorators(
    ApiExtraModels(Paginated, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
