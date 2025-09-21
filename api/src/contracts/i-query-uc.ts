// Read operations (list, search)
export interface IQueryUseCase<TOutput> {
  perform(): Promise<TOutput>;
}
