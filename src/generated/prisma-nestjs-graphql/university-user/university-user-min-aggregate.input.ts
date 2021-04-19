import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UniversityUserMinAggregateInput {
    @Field(() => Boolean, {nullable:true})
    universityId?: true;

    @Field(() => Boolean, {nullable:true})
    userId?: true;

    @Field(() => Boolean, {nullable:true})
    roleId?: true;
}