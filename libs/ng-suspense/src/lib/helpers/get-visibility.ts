import { Visibility } from '../models/visibility';

export function getVisibility(
  data: boolean,
  loading: boolean,
  error: boolean,
  prioritizeDataOverLoading: boolean,
  prioritizeDataOverError: boolean
): Visibility {
  /*return {
      data: !loading && !error && data,
      empty: !loading && !error && !data,
      loading: loading,
      error: !loading && error,
    }*/

  return {
    data: data && (!loading || prioritizeDataOverLoading) && (!error || prioritizeDataOverError),
    empty: !data && !loading && !error,
    loading: loading && !(data && prioritizeDataOverLoading),
    error: !loading && error && !(data && prioritizeDataOverError),
  };
}
