<?php

declare(strict_types=1);

namespace App\Dto\Enum;

enum ContactSubjectEnum: string
{
    case JobOffer           = 'job_offer';
    case ProjectProposition = 'project_proposition';
    case Networking         = 'networking';
    case OtherMotive        = 'other_motive';

    /**
     * Subjects qui rendent link_proposition obligatoire.
     */
    public function requiresLink(): bool
    {
        return match ($this) {
            self::JobOffer, self::ProjectProposition => true,
            default                                  => false,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::JobOffer           => 'Offre d\'emploi',
            self::ProjectProposition => 'Proposition de projet',
            self::Networking         => 'Networking / échange',
            self::OtherMotive        => 'Autre',
        };
    }
}
