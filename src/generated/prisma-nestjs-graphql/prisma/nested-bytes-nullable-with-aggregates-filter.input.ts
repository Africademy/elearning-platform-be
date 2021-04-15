import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { NestedIntNullableFilter } from './nested-int-nullable-filter.input';
import { NestedBytesNullableFilter } from './nested-bytes-nullable-filter.input';

@InputType()
export class NestedBytesNullableWithAggregatesFilter {
    @Field(() => String, {nullable:true})
    equals?: Buffer;

    @Field(() => NestedBytesNullableWithAggregatesFilter, {nullable:true})
    not?: NestedBytesNullableWithAggregatesFilter;

    @Field(() => NestedIntNullableFilter, {nullable:true})
    count?: NestedIntNullableFilter;

    @Field(() => NestedBytesNullableFilter, {nullable:true})
    min?: NestedBytesNullableFilter;

    @Field(() => NestedBytesNullableFilter, {nullable:true})
    max?: NestedBytesNullableFilter;
}
