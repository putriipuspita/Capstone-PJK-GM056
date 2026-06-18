import csv
import io
from dataclasses import dataclass


REQUIRED_COLUMNS = ("Tanggal", "Review", "Rating")
REQUIRED_COLUMN_KEYS = ("tanggal", "review", "rating")


@dataclass(frozen=True)
class ReviewRow:
    review_date: str
    review_text: str
    rating: str


def parse_review_csv(content: bytes) -> list[ReviewRow]:
    text = content.decode("utf-8-sig")
    reader = csv.reader(io.StringIO(text))
    headers = next(reader, None)

    if not headers:
        raise ValueError("File CSV tidak memiliki header.")

    column_map = {column.strip().lower(): index for index, column in enumerate(headers)}
    missing_columns = [column for column in REQUIRED_COLUMN_KEYS if column not in column_map]
    if missing_columns:
        missing = ", ".join(REQUIRED_COLUMNS)
        raise ValueError(f"Kolom wajib tidak ditemukan: {missing}.")

    rows: list[ReviewRow] = []
    for row_number, raw_row in enumerate(reader, start=2):
        if not raw_row or all(not value.strip() for value in raw_row):
            continue

        row = _repair_unquoted_review_commas(raw_row, len(headers), column_map["review"])

        review_text = row[column_map["review"]].strip()
        if not review_text:
            continue

        rows.append(
            ReviewRow(
                review_date=row[column_map["tanggal"]].strip(),
                review_text=review_text,
                rating=row[column_map["rating"]].strip(),
            )
        )

    if not rows:
        raise ValueError("File CSV tidak memiliki data review yang valid.")

    return rows


def _repair_unquoted_review_commas(row: list[str], expected_columns: int, review_index: int) -> list[str]:
    if len(row) == expected_columns:
        return row

    if len(row) < expected_columns:
        raise ValueError("Format CSV tidak valid. Jumlah kolom pada salah satu baris kurang dari header.")

    extra_columns = len(row) - expected_columns
    merged_review = ",".join(row[review_index : review_index + extra_columns + 1])
    repaired_row = row[:review_index] + [merged_review] + row[review_index + extra_columns + 1 :]

    if len(repaired_row) != expected_columns:
        raise ValueError("Format CSV tidak valid. Jumlah kolom pada salah satu baris tidak sesuai header.")

    return repaired_row
