<?php

declare(strict_types=1);

namespace App\Dto\Enum;

enum SkillLevelEnum: string
{
    case Debutant = 'debutant';
    case Intermediaire = 'intermediaire';
    case Confirme = 'confirme';
    case Senior = 'senior';
    case Expert = 'expert';
}
