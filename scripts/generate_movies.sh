#!/bin/bash
DEFAULT_POWS=50;
DEFAULT_TARGET_FILE=populate.sql
FROM=1;
TO=${1:-$DEFAULT_POWS};
TARGET_FILE=${2:-$DEFAULT_TARGET_FILE};
echo "Generating $TO random movies TO $TARGET_FILE...";
echo '' > $TARGET_FILE;
for (( i=$FROM; i<=$TO; i++ )); do
  echo -n '.'$i;
    echo "insert into movie(title, description, short_description, duration, release_date) values ('My Movie $i', 'Descr $i', 'Short descr $i', "$RANDOM", '"`date -d "now - ${RANDOM}day"  +%Y-%m-%d\ %H:%M:%S`"');" >> $TARGET_FILE;

    TMP_COUNT=$RANDOM
    IMAGE_COUNT=$(($TMP_COUNT % 3))
    for (( j=$FROM; j<=$IMAGE_COUNT; j++ )); do
      echo -n 'i';
      echo "insert into movie_image(image_type_id, movie_id, url) values ("$j", "$i", '"$RANDOM".jpg');" >> $TARGET_FILE;
    done

    TMP_COUNT=$RANDOM
    GENRE_COUNT=$(($TMP_COUNT % 3))
    for (( j=$FROM; j<=$GENRE_COUNT; j++ )); do
      echo -n 'g';
      echo "insert into movie_genre(genre_id, movie_id) values ("$j", "$i");" >> $TARGET_FILE;
    done
    echo >> $TARGET_FILE;
done
echo;
echo "$TO generated SQL rows are written to $TARGET_FILE."