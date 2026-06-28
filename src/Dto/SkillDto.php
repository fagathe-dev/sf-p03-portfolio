<?php

declare(strict_types=1);

namespace App\Dto;

final class SkillDto
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
        public readonly string $icon,
        public readonly string $category,
        public readonly string $level,
        public readonly ?bool $isHighlight = null,
    ) {
    }
}
