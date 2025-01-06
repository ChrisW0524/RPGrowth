import { UniqueIdentifier } from '@dnd-kit/core';


export type Id = string | number


export type Column = {
    id: Id;
    title: string
}

export type Type = {
  id: UniqueIdentifier;
  title: string;
};