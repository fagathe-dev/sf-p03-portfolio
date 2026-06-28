<?php

declare(strict_types=1);

namespace App\Dto;

final class ProjectDto
{
    /**
     * @param string[] $stack
     */
    public function __construct(
        public readonly string $id,
        public readonly string $slug,
        public readonly string $name,
        public readonly ?string $thumbnail,
        public readonly array $stack,
        public readonly string $description,
        public readonly string $excerpt,
        public readonly string $date,
        public readonly ?string $github = null,
        public readonly ?string $live_link = null,
    ) {
    }
}
