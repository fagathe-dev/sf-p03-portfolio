<?php

declare(strict_types=1);

namespace App\Dto\Enum;

enum SkillCategoryEnum: string
{
    case FrontEnd = 'front_end';
    case BackEnd = 'back_end';
    case Other = 'other';
}
