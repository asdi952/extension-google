dir_path=$(readlink -f "$0")
path=$(dirname  $dir_path)
zip_name="googleSearch_keyboar_sup"

cd $path

rm -f $zip_name.zip 

zip "$zip_name.zip" ./* -x $(basename $0) -x *.zip
 
