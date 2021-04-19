import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { ScopeWhereUniqueInput } from './scope-where-unique.input';

@ArgsType()
export class DeleteOneScopeArgs {
    @Field(() => ScopeWhereUniqueInput, {nullable:false})
    where!: ScopeWhereUniqueInput;
}