import { Response } from "express";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : 500;

    Logger.error(exception?.name || "Unexpected error", exception?.stack, [
      {
        message: exception?.message,
        hostType: host.getType(),
        request: {
          url: request?.url,
          body: request?.body,
          headers: request?.headers,
        },
      },
    ]);

    const errorResponse = isHttpException
      ? exception.getResponse()
      : {
          statusCode: status,
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        };

    response.status(status).json(errorResponse);
  }
}
