<?php

declare(strict_types=1);

namespace App\Dto;

final class TimelineItemDto
{
    /**
     * @param string[]|null $highlights
     * @param string[]|null $stack
     */
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly string $title,
        public readonly string $organization,
        public readonly string $location,
        public readonly string $startDate,
        public readonly ?string $endDate,
        public readonly ?string $description = null,
        public readonly ?array $highlights = null,
        public readonly ?array $stack = null,
    ) {
    }
}
