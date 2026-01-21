/*React Query
Query: Read data
Mutation: change data (create, update, delete, login)
*/

import { ErrorResponse } from "@/models/common/APIError";
import { MutationFunction, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query"

export const useReactMutation = <
    TData = unknown, // Backend Response
    TError = ErrorResponse,
    TVariables = void, // Request Body
    TContext = unknown
    >(
        mutationFn: MutationFunction<TData, TVariables>,
        options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationKey' | 'mutationFn' //omit mutationKey and mutationFn from options as we input or manage by another way.
        >, 
        isLoading = true
    ): UseMutationResult<TData, TError, TVariables, TContext | void> => {
    
    const tOptions = {...options};

    return useMutation({
        mutationFn,
        ...{
            ...tOptions,
            onMutate(variables) {
                tOptions?.onMutate && tOptions?.onMutate(variables);
            },
            onSuccess(data, variables, context) {
                tOptions?.onSuccess && tOptions?.onSuccess(data, variables, context as TContext);
            },
            onError(error, variables, context) {
                tOptions?.onError && tOptions?.onError(error, variables, context as TContext);
            },
            onSettled(data, error, variables, context) {
                tOptions?.onSettled && tOptions?.onSettled(data, error, variables, context as TContext);
            }
        }
    }
    );
}