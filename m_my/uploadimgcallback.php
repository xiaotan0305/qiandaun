<?php
/**
 * Project: �ֻ��ѷ�
 * File: uploadimgcallback.php
 *
 *
 * <pre> ������ͼƬ�ϴ��ļ� </pre>
 *
 * @category   PHP
 * @package    Web
 * @subpackage Web
 * @author     yueyanlei <yueyanlei@soufun.com>
 * @copyright  2013 Soufun, Inc.
 * @license    BSD Licence
 * @link       http://example.com
 */

/**
 *ͼƬ�ϴ��ļ�
 *
 *
 * Long description for file (if any)...
 *
 * @category   PHP
 * @package    File
 * @subpackage Web
 * @author     yueyanlei <yueyanlei@soufun.com>
 * @copyright  2013 Soufun, Inc.
 * @license    BSD Licence
 * @link       http://example.com
 */
$host = $_SERVER['HTTP_HOST'];
preg_match("/[\w\-]+\.\w+$/", $host, $arr);
$domain = $arr[0];
?><!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gbk" />
<title>uploadimgcallback</title><br>
<script>
document.domain = "<?php echo $domain;?>";
</script>
</head>

<body>
<div><?php echo $_GET['imgurl'];?></div>
</body>
</html>
