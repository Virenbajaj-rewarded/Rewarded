import { ApiProperty } from '@nestjs/swagger';

export class MerchantStatsOverviewDto {
  @ApiProperty({
    example: 124,
    description:
      'Total unique customers that have had at least one reward transaction with this merchant',
  })
  totalCustomers: number;

  @ApiProperty({
    example: 12,
    description:
      'Number of customers whose first transaction with this merchant occurred in the previous full calendar month',
  })
  newCustomersLastMonth: number;

  @ApiProperty({
    example: 52340,
    description:
      'Total points credited to all customers by this merchant (lifetime). Sum of REDEEM transactions where fromUserId = merchant user',
  })
  totalPointsCredited: number;

  @ApiProperty({
    example: 41200,
    description:
      'Total points redeemed/used by customers at this merchant (lifetime). Sum of REDEEM transactions where toUserId = merchant user',
  })
  totalPointsRedeemed: number;
}
