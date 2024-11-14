import { Header } from '@/header/Header.ts';
import { CharsetType, StatusTextType } from '@/http/types.ts';

export interface IResponse {
    readonly header: Header;
    text: (
        content: string,
        status?: StatusTextType,
        charset?: CharsetType,
    ) => this;
    html: (
        content: string,
        status?: StatusTextType,
        charset?: CharsetType,
    ) => this;
    json: (
        data: Record<string, unknown>,
        status?: StatusTextType,
        charset?: CharsetType,
    ) => this;
    stream: (data: string | ReadableStream, status?: StatusTextType) => this;
    exception: (
        message: string,
        data?: Record<string, unknown> | null,
        status?: StatusTextType,
    ) => this;
    notFound: (
        message: string,
        data?: Record<string, unknown> | null,
        status?: StatusTextType,
    ) => this;
    redirect: (url: string | URL, status?: StatusTextType) => Response;
    getData: () => Record<string, unknown>;
    build: () => Response;
}
