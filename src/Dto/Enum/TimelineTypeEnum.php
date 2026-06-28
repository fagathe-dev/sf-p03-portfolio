<?php

declare(strict_types=1);

namespace App\Dto\Enum;

enum TimelineTypeEnum: string
{
    case Education = 'education';
    case Experience = 'experience';
}
