// Consultas que só lêem dados (list, search)
export interface IQueryUseCase<TOutput> {
  perform(): Promise<TOutput>;
}
